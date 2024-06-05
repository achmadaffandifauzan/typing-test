"use server"; // somehow need to be explicitly set, if not, it will be a client component
import prisma from "@/lib/prisma";
import { getOneUser } from "@/prisma/functions/user";
import { Prisma } from "@prisma/client";
export const saveResultToDatabase = async (
  attemptResult: any,
  attemptNumber: number,
  session: any
) => {
  const { username } = session.user;
  try {
    // using ORM directly in the server component here
    const user = await getOneUser(username);
    if (!user) {
      throw new Error("Failed to save, no user found!");
    }
    // console.log("user whos trying to save ", user);
    const quotesObject: Prisma.JsonArray = attemptResult.quotes.map(
      (quote: any) => {
        return {
          text: quote.text,
          author: quote.author,
          words: quote.words.map((word: any) => {
            return {
              text: word.text,
              chars: word.chars.map((char: any) => {
                return {
                  text: char.text,
                  typeStatus: char.typeStatus,
                  userInput: char.userInput,
                };
              }),
            };
          }),
        };
      }
    );
    const wrongCharactersObject: Prisma.JsonArray =
      attemptResult.wrongCharacters as Prisma.JsonArray;
    const wpm: number = attemptResult.wpm;
    const accuracy: number = attemptResult.accuracy;

    // now, quotes obj and wrongChars obj saved in json, so they can't be regularly sql queried, but for future work, they can be created as separated entity
    // why? (1) because of the need, now, the web only show the basic stats, not a deeper analytics; (2) to decrease db read and write volume
    // UPDATE, actually, prisma provide many methods to query and filter json object -> https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields
    await prisma.typingHistory.create({
      data: {
        quotes: quotesObject,
        wrongCharacters: wrongCharactersObject,
        wpm: wpm,
        accuracy: accuracy,
        author: { connect: { id: user.id } },
      },
      include: {
        author: true,
      },
    });
    return true;
    // // use client-server REST communication
    // convert data to json
    // const savingResponseJSON = await fetch("/api/typing", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({}),
    // });
    // return newTypingHistory;
    // if (savingResponseJSON.status == 200) {
    //   return savingResponseJSON;
    // } else {
    //   throw new Error("Error while saving your result");
    // }
  } catch (error) {
    console.log(error);
    return false;
  }
};
