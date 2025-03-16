const API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export type DictionaryResponse = {
  word: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
    }>;
  }>;
};

// Cache for validated words to reduce API calls
const validatedWordsCache = new Set<string>();

export const isValidWord = async (word: string): Promise<boolean> => {
  word = word.toLowerCase();
  
  // Check cache first
  if (validatedWordsCache.has(word)) {
    return true;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${word}`);
    if (!response.ok) {
      return false;
    }

    const data: DictionaryResponse[] = await response.json();
    const isValid = data.length > 0 && data[0].word.length === 5;
    
    if (isValid) {
      validatedWordsCache.add(word);
    }
    
    return isValid;
  } catch (error) {
    console.error('Error validating word:', error);
    return false;
  }
};

export const getRandomWord = async (): Promise<string> => {
  try {
    const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
    if (!response.ok) {
      throw new Error('Failed to fetch random word');
    }

    const [word] = await response.json();
    
    // Validate the word exists in dictionary
    const isValid = await isValidWord(word);
    if (!isValid) {
      // Try again if word is not valid
      return getRandomWord();
    }

    return word.toUpperCase();
  } catch (error) {
    console.error('Error getting random word:', error);
    // Fallback to a simple common word if API fails
    return 'WORLD';
  }
}; 