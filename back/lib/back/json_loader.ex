defmodule JsonLoader do

  # POUR ETS
  def load_to_database(database, json_file) do
    json_file_content = File.read!(json_file)
    json_file_content_decode = Poison.decode!(json_file_content)

    json_file_content_decode
    |> Stream.map(fn x -> {x["id"], x} end)
    |> Enum.map(fn x -> database.create(x) end)
  end

  # POUR RIAK
  def load_to_riak(json_file) do
    json_file_content = File.read!(json_file)
    json_file_content_decode = Poison.decode!(json_file_content)

    json_file_content_decode
    |> Task.async_stream(fn(x) -> :httpc.request(:put, {'#{Riak.url}/buckets/ALBIN_ORDERS_2/keys/#{x["id"]}?returnbody=true', Riak.auth_header(), 'application/json', Poison.encode!(x)}, [], []) end, max_concurrency: 10, timeout: :infinity)
    |> Stream.run()
  end
end
