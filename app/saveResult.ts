"use server"; // maybe if the file is just .ts, the default value is use client, so need to explicitly state the use server
export const saveResultToDatabase = async (data: any, session: any) => {
  const { WPM, accuracy, allTypedChar, wrongCharacters } = data;
  console.log("seSSIOOOON", session);
  try {
    console.log(data);
    const savingResponseJSON = await fetch("/api/typing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wpm: WPM,
        accuracy,
        allTypedChar,
        wrongCharacters,
      }),
    });
    console.log(savingResponseJSON);
    if (savingResponseJSON.status == 200) {
      return savingResponseJSON;
    } else {
      throw new Error("Error while saving your result");
    }
  } catch (error) {
    return error;
  }
};
