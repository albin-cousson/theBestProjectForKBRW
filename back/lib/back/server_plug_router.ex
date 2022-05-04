defmodule Server.PlugRouter do
  use Plug.Router
  use Plug.ErrorHandler
  alias VerifyRequest

  require EEx
  EEx.function_from_file :defp, :layout, "web/layout.html.eex", [:render]

  # plug Plug.Static, from: "priv/static", at: "/static"
  plug Plug.Static, at: "/public", from: :back
  plug Plug.Parsers, parsers: [:urlencoded, :multipart]
  # plug VerifyRequest, fields: ["key"], paths: ["/lookup"]
  # plug VerifyRequest, fields: ["key"], paths: ["/search"]
  # plug VerifyRequest, fields: ["key", "value"], paths: ["/create"]
  # plug VerifyRequest, fields: ["key", "value"], paths: ["/update"]
  # plug VerifyRequest, fields: ["key"], paths: ["/delete"]

  plug :match
  plug :dispatch

  # get "/" do
  #   send_resp(conn, 200, "Welcome")
  # end

  # match "/lookup", via: :get do
  #   %{"key" => key} = conn.query_params
  #   {:ok, res} = Database.lookup(key)
  #   res = Poison.encode!(res)
  #   send_resp(conn, 201, res)
  # end

  # match "/search", via: :get do
  #   %{"key" => value} = conn.query_params
  #   res = Database.search(Database, [{"id", value}])
  #   {k, v} = Enum.map(res, fn x -> Enum.map(x, fn y -> i y end)end)
  #   send_resp(conn, 200, res)
  # end

  # match "/create", via: :get do
  #   %{"key" => key, "value" => value} = conn.query_params
  #   res = Database.create({key, value})
  #   res = Poison.encode!(res)
  #   send_resp(conn, 200, res)
  # end

  # match "/update", via: :get do
  #   %{"key" => key, "value" => value} = conn.query_params
  #   res = Database.update({key, value})
  #   res = Poison.encode!(res)
  #   send_resp(conn, 200, res)
  # end

  # match "/delete", via: :get do
  #   %{"key" => key} = conn.query_params
  #   res = Database.delete(key)
  #   res = Poison.encode!(res)
  #   send_resp(conn, 200, res)
  # end

  match "/api/orders", via: :get do
    # {:ok, res} = Database.lookupAll()
    # res = Poison.encode!(res)

    # page=0&rows=45&type=nat_order&id=nat_order45678765

    case Enum.empty?(conn.query_params) do
      false ->

        page = conn.query_params["page"]
        rows = conn.query_params["rows"]
        payment = conn.query_params["payment"]

        case payment do
          "init" ->
            order_id = conn.query_params["order_id"]
            {:ok, {{_, 200, _message}, _headers, order}} = Riak.findAllObjectInSpecificKey("ALBIN_ORDERS_2", order_id)
            Supervisor.start_child(ServSupervisor, {GenServerChangePayementStatus, Poison.decode!(order)})
            {:next_state, res} = GenServer.call(String.to_atom(order_id), :done)
            IO.inspect(res)
            {:ok, {{_, 200, _message}, _headers, body}} = Riak.createObjectInSpecificBucketAndKey("ALBIN_ORDERS_2", to_string(order_id), Poison.encode!(res))

            :timer.kill_after(:timer.minutes(5), order_id)

            send_resp(conn, 201, body)
          nil ->
            query = Enum.filter(conn.query_params, fn {x, y} ->
              case x do
                "page" -> false
                "rows" -> false
                _ -> {x, y}
              end
            end)

            queryStep1 = Enum.map(query, fn {w, y} ->
              Enum.join([w, y], ":")
            end)

            queryEncode = Enum.join(queryStep1, "%20AND%20")

            {rows, body} = Riak.search("albin_orders_index", queryEncode, page, rows)
            bodyParse = Poison.decode!(body)

            list = bodyParse["response"]["docs"]
            |> Enum.map(fn x ->
              {:ok, {{_, 200, _message}, _headers, body}} = Riak.findAllObjectInSpecificKey("ALBIN_ORDERS_2", x["id"])
              Poison.decode!(body)
            end)

            list = Poison.encode!(list)
            numFound = bodyParse["response"]["numFound"]
            forPage = Poison.encode!([rows, numFound])
            listForSend = Poison.decode!(list) ++ Poison.decode!(forPage)

            send_resp(conn, 201, Poison.encode!(listForSend))

            _ -> send_resp(conn, 201, Poison.encode!("Commande en cours de traitement"))

        end

      true ->

          {rows, body} = Riak.search("albin_orders_index", "")
          bodyParse = Poison.decode!(body)

          list = bodyParse["response"]["docs"]
          |> Enum.map(fn x ->
            {:ok, {{_, 200, _message}, _headers, body}} = Riak.findAllObjectInSpecificKey("ALBIN_ORDERS_2", x["id"])
            Poison.decode!(body)
          end)

          list = Poison.encode!(list)
          numFound = bodyParse["response"]["numFound"]
          forPage = Poison.encode!([30, numFound])
          listForSend = Poison.decode!(list) ++ Poison.decode!(forPage)

          send_resp(conn, 201, Poison.encode!(listForSend))

      end
  end

  match "/api/order/:order_id", via: :get do
    {:ok, {{_, 200, _message}, _headers, body}} = Riak.findAllObjectInSpecificKey(:ALBIN_ORDERS_2, order_id)
    send_resp(conn, 201, body)
  end

  match "/api/order/:order_id", via: :delete do
    Riak.deleteObjectInSpecificBucketAndKey(:ALBIN_ORDERS_2, order_id)
    res = Poison.encode!(:ok)
    send_resp(conn, 201, res)
  end

  # defp handle_errors(conn, %{kind: kind, reason: reason, stack: stack}) do
  #   IO.inspect(kind, label: :kind)
  #   IO.inspect(reason, label: :reason)
  #   IO.inspect(stack, label: :stack)
  #   send_resp(conn, conn.status, "Something went wrong")
  # end

  # get _, do: send_file(conn, 200, "priv/static/index.html")

  get _ do
    conn = fetch_query_params(conn)
    render = Reaxt.render!(:app, %{path: conn.request_path, cookies: conn.cookies, query: conn.params},30_000)
    send_resp(put_resp_header(conn, "content-type", "text/html;charset=utf-8"), render.param || 200, layout(render))
  end

  match(_, do: send_resp(conn, 404, "Page Not Found"))

end
