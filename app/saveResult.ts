"use server"; // maybe if the file is just .ts, the default value is use client, so need to explicitly state the use server
import prisma from "@/lib/prisma";
import { getOneUser } from "@/prisma/functions/user";
export const saveResultToDatabase = async (data: any, session: any) => {
  const { WPM, accuracy, allTypedChar, wrongCharacters } = data;
  const { username } = session.user;
  try {
    // console.log("result to be stored", data);

    // using ORM directly in the server components here
    const user = await getOneUser(username);
    if (!user) {
      throw new Error("No user found!");
    }
    // console.log("user whos trying to save ", user);
    // convert data to json
    const jsonAllTypedChar: string = JSON.stringify(allTypedChar);
    const jsonWrongCharacters: string = JSON.stringify(wrongCharacters);

    // // use client-server REST communication
    // const savingResponseJSON = await fetch("/api/typing", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     wpm: WPM,
    //     accuracy,
    //     allTypedChar:jsonAllTypedChar,
    //     wrongCharacters : jsonWrongCharacters,
    //     authorId: user.id,
    //   }),
    // });

    // using ORM directly in the server components here
    await prisma.typingHistory.create({
      data: {
        wpm: WPM,
        wrongCharacters: jsonWrongCharacters,
        allTypedChar: jsonAllTypedChar,
        accuracy: accuracy,
        author: { connect: { id: user.id } },
      },
      include: {
        author: true,
      },
    });
    // return newTypingHistory;
    // if (savingResponseJSON.status == 200) {
    //   return savingResponseJSON;
    // } else {
    //   throw new Error("Error while saving your result");
    // }
    return true;
  } catch (error) {
    // console.log(error)
    return false;
  }
};
