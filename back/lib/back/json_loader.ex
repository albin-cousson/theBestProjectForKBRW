defmodule JsonLoader do
  def load_to_database(database, json_file) do
    json_file_content = File.read!(json_file)
    json_file_content_decode = Poison.decode!(json_file_content)

    json_file_content_decode
    |> Stream.map(fn x -> {x["id"], x} end)
    |> Enum.map(fn x -> database.create(x) end)
  end
end
