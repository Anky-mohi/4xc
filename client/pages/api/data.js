export default function handler(req, res) {
    const data = [
      {
        imageUrl: "https://dummyimage.com/600x400/000/fff",
        title: "Item 1",
        description: "Description for item 1",
      },
      {
        imageUrl: "https://dummyimage.com/hd1080",
        title: "Item 2",
        description: "Description for item 2",
      },
    ];
    res.status(200).json(data);
  }
  