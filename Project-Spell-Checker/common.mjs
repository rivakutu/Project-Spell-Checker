import words from "./words.json" with { type: "json" };

export const getDictionarySize = () => words.length;


// function to check if spelling exists in dictionary
export function checkerEngine(tokenizedWords){
    const misspelledWords = [];
    tokenizedWords.forEach(word => {
        if (!words.includes(word)) {
            misspelledWords.push(word);
        }
    });
    return misspelledWords;
}
