require 'rubygems'
require 'sinatra'
require 'haml'
require 'sass'
require 'sqlite3'
require 'datamapper'

DataMapper.setup(:default, "sqlite3:///#{Dir.pwd}/db/goto.sqlite")

class Place
  include DataMapper::Resource
  property :id,           Serial
  property :name,         Text
  property :yahoo_id,     Text
  property :checkins,     Integer
  property :date,         Date
  property :category,     Text
end

get '/' do
  haml :index
end

# static routes
get '/views/main.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :main
end