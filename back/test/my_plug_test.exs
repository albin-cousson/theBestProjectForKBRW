defmodule MyPlugTest do
  use ExUnit.Case, async: true
  use Plug.Test

  @opts TheFirstPlug.init([])

  test "returns hello world" do
    # Create a test connection
    conn = conn(:get, "/hello")

    # Invoke the plug
    conn = TheFirstPlug.call(conn, @opts)

    # Assert the response and status
    assert conn.state == :sent
    assert conn.status == 200
    assert conn.resp_body == "world"
  end
end
