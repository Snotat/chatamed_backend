const Messages = require("../models/messageModel");
const config = require("dotenv");
const OpenAIApi = require("openai");
const Configuration = require("openai");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    console.log(req.body);
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getRob = async (req, res, next) => {
  console.log(req.body.question);
  try {
    config();

    // Initialize OpenAI API
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: req.body.question,
    });
    console.log(completion.data);
    return res.json(completion.data.choices[0].text);
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
};

module.exports.getmsg = async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log(id);
    const messages = await Messages.find({
      users: {
        $in: [id],
      },
    }).sort({ updatedAt: 1 });
    console.log(messages);

    res.json(messages);
  } catch (ex) {
    next(ex);
  }
};
