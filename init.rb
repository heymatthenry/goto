require 'rubygems'
require 'sinatra'
require 'fireeagle'
require 'YAML'

config = YAML::load_file("config.yml")

client = FireEagle::Client.new(
  :consumer_key         => config["oauth"]["consumer_key"],
  :consumer_secret      => config["oauth"]["consumer_secret"],
  :access_token         => config["oauth"]["access_token"],
  :access_config_secret => config["oauth"]["access_token_secret"]
  )
  
get '/' do
  haml :index
end

# static routes
get '/main.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :main
end