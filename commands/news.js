const moment = require('moment');
const fetch = require('node-fetch');
const { RichEmbed } = require('discord.js');
const subreddits = ["anime_titties","news","worldnews","anythinggoesnews","inthenews","onthescene","qualitynews","thenews","upliftingnews","USNews"];

module.exports = {
	name: 'news',
	description: 'Get random news from Reddit.',
  aliases: ['worldnews'],
  cooldown: 1,
	async execute(message) {
    const asubreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
      const ameme = await fetch(`https://imgur.com/r/${asubreddit}/hot.json`).then(response => response.json());
      if (!ameme.data) return;
      const imgurData = ameme.data[Math.floor(Math.random() * ameme.data.length)];
      if (!imgurData) return null;
      const image = `https://i.imgur.com/${imgurData.hash}${imgurData.ext.replace(/\?.*/, "")}`;
      if (image && image.includes(".mp4")) image = ameme;
      if (!image || image.includes(".mp4")) return message.channel.send(`Woah too fast, Try again.`);
      const memeEmbed = new RichEmbed()
      .setColor('RANDOM')
      .setTitle(imgurData.title)
      .setURL(`https://www.reddit.com${imgurData.reddit}`)
      .setImage(image)
      .setFooter(`from /r/${asubreddit} - Requested by ${message.author.tag}`, message.author.displayAvatarURL)
      .setTimestamp()
      message.channel.send(memeEmbed);
  },
};
