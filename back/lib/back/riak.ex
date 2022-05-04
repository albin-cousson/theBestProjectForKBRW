defmodule Riak do
  def url, do: "https://kbrw-sb-tutoex-riak-gateway.kbrw.fr"

  def auth_header do
    username = "sophomore"
    password = "jlessthan3tutoex"
    auth = :base64.encode_to_string("#{username}:#{password}")
    [{'authorization', 'Basic #{auth}'}]
  end

  # def initialize_commands() do
  #   {rows, body} = Riak.search("albin_orders_index", "")
  #   bodyParse = Poison.decode!(body)

  #   list = bodyParse["response"]["docs"]
  #   |> Enum.map(fn x ->
  #     {:ok, {{_, 200, _message}, _headers, body}} = Riak.findAllObjectInSpecificKey("ALBIN_ORDERS_2", x["id"])
  #     Poison.decode!(body)
  #   end)
  #   |> Enum.map(fn y ->
  #     y["status"]["state"] = "init"
  #   end)

  # end

  def findAllBucket do
    {:ok, {{_, 200, _message}, _headers, body}} = :httpc.request(:get, {'#{url}/buckets?buckets=true', auth_header()}, [], [])
  end

  def findAllKeysInSpecificBucket(bucket) do
    {:ok, {{_, 200, _message}, _headers, body}} = :httpc.request(:get, {'#{url}/buckets/#{bucket}/keys?keys=true', auth_header()}, [], [])
  end

  def findAllObjectInSpecificKey(bucket, key) do
    {:ok, {{_, 200, _message}, _headers, body}} = :httpc.request(:get, {'#{url}/buckets/#{bucket}/keys/#{key}', auth_header()}, [], [])
    # {:ok, body}
  end

  def createObjectInSpecificBucketAndKey(bucket, key, value) do
    {:ok, {{_, 200, _message}, _headers, body}} = :httpc.request(:put, {'#{url}/buckets/#{bucket}/keys/#{key}?returnbody=true', auth_header(), 'application/json', value}, [], [])
  end

  def deleteObjectInSpecificBucketAndKey(bucket, key) do
    :httpc.request(:delete, {'#{url}/buckets/#{bucket}/keys/#{key}', auth_header()}, [], [])
  end

  def uploadShema(name_shema) do
    {:ok, {{_, 200, _message}, _headers, body}} = :httpc.request(:put, {'#{url}/search/schema/#{name_shema}', auth_header(), 'application/xml', elem(:file.read_file('json_for_database/order_schema.xml'), 1)}, [], [])
  end

  def createIndex(name_index, name_shema) do
    {:ok, {{_, 200, _message}, _headers, body}} = :httpc.request(:put, {'#{url}/search/index/#{name_index}', auth_header(), 'application/json', '{"schema": "#{name_shema}"}'}, [], [])
  end

  def searchAllIndex do
    {:ok, {{_, 200, _message}, _headers, body}} = :httpc.request(:get, {'#{url}/search/index', auth_header()}, [], [])
  end

  def assignIndexAtSpecificBucket(bucket, name_index) do
    {:ok, {{_, 200, _message}, _headers, body}} = :httpc.request(:put, {'#{url}/buckets/#{bucket}/props', auth_header(), 'application/json', '{"props":{"search_index":"#{name_index}"}}'}, [], [])
  end

  def emptyPropsBucket(bucket) do
    {:ok, {{_, 200, _message}, _headers, body}} = :httpc.request(:delete, {'#{url}/buckets/#{bucket}/props', auth_header()}, [], [])
  end

  def search(index, query, page \\ 0, rows \\ 30, sort \\ "creation_date_index") do
      page = if page == nil do
        0
      else
        if is_number(page) do
          page
        else
          String.to_integer(page)
        end
      end

      rows = if rows == nil do
        30
      else
        if is_number(rows) do
          rows
        else
          String.to_integer(rows)
        end
      end

      query = if query == "" do
        "*:*"
      else
        query
      end

      start = page * rows

      {:ok, {{_, 200, _message}, _headers, body}} = :httpc.request(:get, {'#{url}/search/query/#{index}/?wt=json&q=#{query}&start=#{start}&rows=#{rows}', auth_header()}, [], [])
      {rows, body}
  end

  def escape(string) do
    test = String.split(string, "", trim: true)
    |> Enum.map(fn x ->
      if String.match?(x, ~r/^[\ ^ $ . | ? * + ( )]$/) == true do
        "%5c#{x}"
      else
        x
      end
    end)
    Enum.join(test, "")
  end

end
