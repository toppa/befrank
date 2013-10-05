require "sinatra"
require "sinatra/content_for"
require "haml"
require "pipedriver"
require "json"

# This env var needs to be set
# bash> export PIPEDRIVE_API_KEY=abc123

# Handle html files
get '/' do
  base_file_path = File.join(File.dirname(__FILE__), 'public', 'index.html')

  if File.exists?("#{base_file_path}")
    send_file base_file_path
  end
end

post '/newsletter_signup' do
  js_response = {}
  
  # Hand-rolled validation
  if params[:contact][:name].nil? || params[:contact][:name] == ""
    js_response[:status] = 'error'
    js_response[:errors] = { "name" => ["can't be blank"] }
  elsif params[:contact][:email].nil? || params[:contact][:email] == ""
    js_response[:status] = 'error'
    js_response[:errors] = { "email" => ["can't be blank"] }
  else
    Pipedriver.api_key = ENV['PIPEDRIVE_API_KEY']
    person_attrs = {
      :name => params[:contact][:name],
      :email => params[:contact][:email],
      "49585fd0ad348042325d14daee14e13f747a993d" => 96 # Lead origin
    }
    create_person_response = Pipedriver::Person.create(person_attrs)
    new_web_lead_id = create_person_response.success ? create_person_response.data["id"] : nil

    if new_web_lead_id.nil?
      js_response[:status] = 'error'
      js_response[:errors] = create_person_response.error
    else
      activity_attrs = {
        :subject => 'New web lead',
        :type => 'Web-Lead',
        :due_date => Date.today.to_s,
        :person_id => new_web_lead_id
      }
      activity_response = Pipedriver::Activity.create(activity_attrs)

      if activity_response.success
        js_response[:status] = 'ok'
      else
        js_response[:status] = 'error'
        js_response[:errors] = activity_response.error
      end
    end
  end
  
  js_response.to_json
end

get '*' do
  file_path = File.join(File.dirname(__FILE__), 'public',  request.path.downcase)
  File.exist?(file_path) ? send_file(file_path) : halt(404)
end