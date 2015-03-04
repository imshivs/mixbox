import os
from yaml import load, Loader

count = 100

config = load(open('settings.yml', 'r'), Loader=Loader)

os.environ['username'] = config['username']

if os.path.isfile('secret.yml'):
  os.environ.update(load(open('secret.yml', 'r'), Loader=Loader))

# print os.environ


from bot import twitter_follow_bot as Bot

Bot.auto_follow_followers_for_user(config['username'])

for phrase in config['phrases']:
  Bot.auto_follow(phrase, count)

for hashtag in config['hashtags']:
  Bot.auto_fav(hashtag, count)
