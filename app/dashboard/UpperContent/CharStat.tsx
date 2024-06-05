// "use client";
// import React, { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// import { useSession } from "next-auth/react";
// import Loading from "@/app/components/Loading";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// const CharStat = () => {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [loading, setLoading] = useState(false);
//   const [typingHistories, setTypingHistories] = useState([]);
//   const [allWrongChar, setallWrongChar] = useState([]);

//   const fetchTypingHistories = async () => {
//     try {
//       const encodedUsername = encodeURIComponent(session?.user.username!);
//       //   URL that might include special characters should be encoded
//       const response = await fetch(`/api/typing/user/${encodedUsername}`, {
//         method: "GET",
//       });
//       if (response.status === 200) {
//         const typings = await response.json();
//         setTypingHistories(typings);
//         setLoading(false);
//       } else {
//         throw new Error();
//       }
//     } catch (error) {
//       console.error("Error: ", error);
//       toast.error("Failed to fetch dashboard data!", {
//         duration: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (status === "loading") {
//       setLoading(true);
//     } else if (status === "authenticated") {
//       fetchTypingHistories();
//     } else {
//       setLoading(false);
//     }
//   }, [status]);
//   //   useEffect(() => {
//   //     for (let typing of typingHistories) {
//   //       // if (typing.)
//   //     }
//   //   }, [typingHistories]);
//   if (loading) {
//     return <Loading />;
//   }
//   if (status === "unauthenticated") router.push("/login");
//   return <div>CharStat</div>;
// };

// export default CharStat;
