import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Get environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY environment variable is missing");
    }

    const { pdfUrl } = await request.json();
    if (!pdfUrl) throw new Error('PDF URL is required');

    console.log('Fetching PDF from:', pdfUrl);
    const response = await fetch(pdfUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    
    const pdfBuffer = await response.arrayBuffer();
    
    console.log('Parsing PDF...');
    const pdfParse = eval('require')('pdf-parse');
    const pdfData = await pdfParse(Buffer.from(pdfBuffer));
    
    console.log("PDF DATA", {
      pages: pdfData.numpages,
      textLength: pdfData.text.length
    });
    
    const textContent = pdfData.text;
    console.log("PDF TEXT PREVIEW", textContent.substring(0, 500));
    
    // Initialize OpenAI client with API key
    const openai = new OpenAI({
      apiKey: openaiApiKey
    });

    console.log('Generating summary with OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a legal document analyzer. Generate concise summaries focusing on key findings, important facts, and conclusions."
        },
        {
          role: "user",
          content: `Please analyze this legal document and generate a concise summary focusing on the main points, important facts, and conclusions. Format the summary in a clear, structured way.\n\n${textContent}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });
    
    const summary = completion.choices[0].message.content;
    console.log("PDF SUMMARY", summary);
    
    return NextResponse.json({
      summary,
      textContent,
      metadata: {
        pages: pdfData.numpages,
        textLength: textContent.length
      }
    });
    
  } catch (error: any) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { 
        error: `Failed to process PDF: ${error.message}`,
        details: {
          code: error.code,
          message: error.message,
          stack: error.stack
        }
      },
      { status: 500 }
    );
  }
}