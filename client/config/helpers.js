export const transformName = name =>{
    const userName = name.split(" ")
    const firstTwoWords = userName.slice(0, 2)
    return firstTwoWords.map(word =>{
        word = word.toUpperCase()
        return word[0]
    }).join(" ")
}