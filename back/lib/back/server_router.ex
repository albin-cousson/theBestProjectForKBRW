defmodule Server.Router do
  use Server.TheCreator

  my_error(code: 404, content: "Go away, you are not welcome here")

  my_get "/" do
    IO.puts("salut")
    {200, "Welcome to the new world of Plugs!"}
  end

  my_get "/me" do
    {200, "You are the Second One."}
  end

  my_get "/test" do
    {200, "This is the test."}
  end
end
