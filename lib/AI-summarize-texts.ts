import axios from 'axios';
import 'dotenv/config';

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!HUGGINGFACE_API_KEY) {
  throw new Error('HUGGINGFACE_API_KEY is not defined in environment variables');
}

// Summarize task description
export const AI_summarize = async (text:string) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const summary = response.data[0].summary_text;
    return summary;
  } catch (error) {
    console.error('Error summarizing task:', error as any);
    return null;
  }
};