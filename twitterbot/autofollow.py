import os
from twitter_follow_bot import auto_follow, auto_follow_followers, auto_fav

from yaml import load, Loader


config = load(open('settings.yml', 'r'), Loader=Loader)

try:
  config.update(load(open('secrets.yml', 'r'), Loader=Loader))
except IOError:
  config.update(os.environ)

OAUTH_TOKEN = config.token
OAUTH_SECRET = config.secret
CONSUMER_KEY = config.consumer_key
CONSUMER_SECRET = config.consumer_secret
TWITTER_HANDLE = config.username

auto_follow_followers_for_user(config['username'])

for phrase in config['phrases']:
  auto_follow(phrase)

for hashtag in config['hashtags']:
  auto_fav(hashtag)
