import axios from 'axios';
import 'dotenv/config';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not defined in environment variables');
}

// Generate subtasks from task title




// Ask AI assistant for help using OpenRouter
export const AI_generateSubtasks = async (taskTitle: string) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-flash-001', // ✅ FREE fast model
        messages: [
          {
            role: 'system',
            content: `Generate 4 subtasks for this task, label each task with a title and a description for example: title: "Task Title", description: "Task Description", list the tasks as an array of objects: "${taskTitle}"`,
          },
          
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://yourwebsite.com', // Optional but good practice
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content?.trim() || '';
    return reply;
  } catch (error) {
    console.error('Error getting assistant reply from OpenRouter:', error as any);
    return null;
  }
};
