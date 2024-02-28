const saveResult = async (content: any) => {
  const fetchPOST = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
  const save = await fetchPOST.json();
  return save;
};

export default saveResult;
