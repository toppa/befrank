require "sinatra/base"
require "sinatra/config_file"
require "haml"
require "json"

class BeFrank < Sinatra::Base
  register Sinatra::ConfigFile
  
  config_file '../config/settings.yml'
  # Handle html files
  get '/' do
    base_file_path = File.join(File.dirname(__FILE__), 'public', 'index.html')

    if File.exists?("#{base_file_path}")
      send_file base_file_path
    end
  end

  post '/newsletter_signup' do
    js_response = { :status => nil, :errors => {} }

    # Hand-rolled validation
    if params[:contact][:name].nil? || params[:contact][:name] == ""
      js_response[:status] = 'error'
      js_response[:errors][:name] = "can't be blank"
    end

    if params[:contact][:email].nil? || params[:contact][:email] == ""
      js_response[:status] = 'error'
      js_response[:errors][:email] = "can't be blank"
    end

    unless js_response[:status] == 'error'
      Pipedriver.api_key = settings.pipedrive_api_key
      person_attrs = {
        :name => params[:contact][:name],
        :email => params[:contact][:email],
        "4c35dc4db71bb5ce0b8ccdab07a3bdd75d14772f" => params[:contact][:company],
        "49585fd0ad348042325d14daee14e13f747a993d" => 97 # Lead origin
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
          :person_id => new_web_lead_id,
          :user_id => settings.pipedrive_assigned_user_id
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

  get '/webfonts/:font_name' do
    content_type(
      case params[:font_name]
        when /\.ttf$/  then 'font/truetype'
        when /\.otf$/  then 'font/opentype'
        when /\.woff$/ then 'font/woff'
        when /\.eot$/  then 'application/vnd.ms-fontobject'
        when /\.svg$/  then 'image/svg+xml'
      end
    )
    file_path = File.join(File.dirname(__FILE__), 'public', 'webfonts', params[:font_name])
    File.exist?(file_path) ? send_file(file_path) : halt(404)
  end

  # Catch-all for static site
  get '*' do
    file_path = File.join(File.dirname(__FILE__), 'public',  request.path.downcase)
    File.exist?(file_path) ? send_file(file_path) : halt(404)
  end
  
end