set :application, "befrank"

set :repository,  "git@github.com:ElectNext/befrank.git"
set :scm, :git
set :branch, $1 if `git branch` =~ /\* (\S+)\s/m

ssh_options[:keys] = '~/.ssh/electnext2.pem'
set :user, 'ubuntu'
set :deploy_to, '/var/www/befrank'
set :use_sudo, false
# set :whenever_environment, 'production'
server "utils.electnext.com", :web, :app, :db

namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end

task :link_to_shared do
  run "ln -nfs #{deploy_to}/#{shared_dir}/config/settings.yml #{release_path}/config/settings.yml"
end

after :deploy, :link_to_shared