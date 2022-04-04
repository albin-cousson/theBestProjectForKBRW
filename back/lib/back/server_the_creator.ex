defmodule Server.TheCreator do
  @doc false
  defmacro __using__(_opts) do
    quote do
      import Server.TheCreator
      import Plug.Conn

      # Initialize @tests to an empty list
      @path []

      # Invoke TestCase.__before_compile__/1 before the module is compiled
      @before_compile Server.TheCreator
    end
  end

  defmacro my_error(args) do
    function_name = String.to_atom("my_error")

    quote do
      @path [unquote(function_name) | @path]
      def unquote(function_name)(conn) do
        conn
        |> put_resp_content_type("text/plain")
        |> send_resp(unquote(args[:code]), unquote(args[:content]))
      end
    end
  end

  defmacro my_get(pattern, do: block) do
    function_name = String.to_atom("my_get " <> pattern)

    quote do
      @path [unquote(function_name) | @path]
      def unquote(function_name)(conn) do
        conn
        |> put_resp_content_type("text/plain")
        |> send_resp(elem(unquote(block), 0), elem(unquote(block), 1))
      end
    end
  end

  @doc false
  defmacro __before_compile__(_env) do
    quote do
      def init(options) do
        # initialize options
        options
      end

      def call(conn, _opts) do
        Enum.map(@path, fn name ->
          [head | body] = String.split(Atom.to_string(name), " ", trim: true)

          if to_string(head) == "my_error" || to_string(body) == conn.request_path do
            apply(__MODULE__, name, [conn])
          end
        end)
      end
    end
  end
end
