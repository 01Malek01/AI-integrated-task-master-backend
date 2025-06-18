function processReadingPlanData(jsonString: string): Array<{ title: string; description: string }> {
    try {
      // Clean the string if necessary (e.g., if pasted with backticks or code fences)
      const cleaned = jsonString
        .replace(/^```json\s*/, '')
        .replace(/```$/, '')
        .trim();
  
      const data = JSON.parse(cleaned);
  
      // Optionally validate structure
      if (!Array.isArray(data)) throw new Error("Invalid data format");
  
      return data.map(item => ({
        title: item.title?.trim(),
        description: item.description?.trim()
      }));
    } catch (error) {
      console.error("Error processing data:", error);
      return [];
    }
  }

  export default processReadingPlanData;