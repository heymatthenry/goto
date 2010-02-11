require 'rubygems'
require 'sinatra'
require 'haml'
require 'sass'

get '/' do
  haml :index
end

# static routes
get '/views/main.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :main
end