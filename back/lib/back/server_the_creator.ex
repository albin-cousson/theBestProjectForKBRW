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
        {code, res} = unquote(block)
        conn
        |> put_resp_content_type("text/plain")
        |> send_resp(code, res)
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
        value =
          @path
          |> Enum.map(fn x ->
            String.split(Atom.to_string(x), " ")
          end)
          |> Enum.find(fn [head | body] ->
            head == "my_error" || to_string(body) == conn.request_path
          end)
          case value do
            [name] ->
              apply(__MODULE__, String.to_atom(name), [conn])
            [name | path] ->
              apply(__MODULE__, String.to_atom(name <> " " <> to_string(path)), [conn])
          end
      end
    end
  end
end
