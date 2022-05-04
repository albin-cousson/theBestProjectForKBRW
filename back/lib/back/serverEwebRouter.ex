defmodule Server.EwebRouter do
  use Ewebmachine.Builder.Resources
  if Mix.env() == :dev, do: plug(Ewebmachine.Plug.Debug)
  resources_plugs(error_forwarding: "/error/:status", nomatch_404: true)
  plug(ErrorRoutes)

  resource "/api/orders" do
    %{}
  after
    # this is also a plug pipeline
    plug(MyJSONApi)
    allowed_methods(do: ["GET"])

    resource_exists do
      conn = fetch_query_params(conn)

      case Enum.empty?(conn.query_params) do
        false ->
          page = conn.query_params["page"]
          rows = conn.query_params["rows"]
          payment = conn.query_params["payment"]

          case payment do
            "init" ->
              order_id = conn.query_params["order_id"]

              {:ok, {{_, 200, _message}, _headers, order}} =
                Riak.findAllObjectInSpecificKey("ALBIN_ORDERS_2", order_id)

              Supervisor.start_child(
                ServSupervisor,
                {GenServerChangePayementStatus, Poison.decode!(order)}
              )

              {:next_state, res} = GenServer.call(String.to_atom(order_id), :done)

              {:ok, {{_, 200, _message}, _headers, body}} =
                Riak.createObjectInSpecificBucketAndKey(
                  "ALBIN_ORDERS_2",
                  to_string(order_id),
                  Poison.encode!(res)
                )

              :timer.kill_after(:timer.minutes(5), order_id)

              res = Map.put(state, :json_obj, body)
              {true, conn, res}

            nil ->
              query =
                Enum.filter(conn.query_params, fn {x, y} ->
                  case x do
                    "page" -> false
                    "rows" -> false
                    _ -> {x, y}
                  end
                end)

              queryStep1 =
                Enum.map(query, fn {w, y} ->
                  Enum.join([w, y], ":")
                end)

              queryEncode = Enum.join(queryStep1, "%20AND%20")
              {rows, body} = Riak.search("albin_orders_index", queryEncode, page, rows)
              bodyParse = Poison.decode!(body)

              list =
                bodyParse["response"]["docs"]
                |> Enum.map(fn x ->
                  {:ok, {{_, 200, _message}, _headers, body}} =
                    Riak.findAllObjectInSpecificKey("ALBIN_ORDERS_2", x["id"])

                  Poison.decode!(body)
                end)

              list = Poison.encode!(list)
              numFound = bodyParse["response"]["numFound"]
              forPage = Poison.encode!([rows, numFound])
              listForSend = Poison.decode!(list) ++ Poison.decode!(forPage)

              res = Map.put(state, :json_obj, Poison.encode!(listForSend))
              {true, conn, res}

            _ ->
              res = Map.put(state, :json_obj, Poison.encode!("Commande en cours de traitement"))
              {true, conn, res}
          end

        true ->
          {rows, body} = Riak.search("albin_orders_index", "")
          bodyParse = Poison.decode!(body)

          list =
            bodyParse["response"]["docs"]
            |> Enum.map(fn x ->
              {:ok, {{_, 200, _message}, _headers, body}} =
                Riak.findAllObjectInSpecificKey("ALBIN_ORDERS_2", x["id"])

              Poison.decode!(body)
            end)

          list = Poison.encode!(list)
          numFound = bodyParse["response"]["numFound"]
          forPage = Poison.encode!([30, numFound])
          listForSend = Poison.decode!(list) ++ Poison.decode!(forPage)

          res = Map.put(state, :json_obj, Poison.encode!(listForSend))
          {true, conn, res}
      end
    end
  end

  resource "/api/order/:order_id" do
    %{order_id: order_id}
  after
    # this is also a plug pipeline
    plug(MyJSONApi)
    allowed_methods(do: ["GET", "DELETE"])

    resource_exists do
      {:ok, {{_, code, _message}, _headers, body}} =
        Riak.findAllObjectInSpecificKey("ALBIN_ORDERS_2", state.order_id)

      res = Map.put(state, :json_obj, body)

      if code in [200, 300, 304] do
        {true, conn, res}
        # else
        #   {false, conn, res}
      end
    end

    delete_resource do
      {:ok, {{_, _, _message}, _headers, body}} =
        Riak.deleteObjectInSpecificBucketAndKey(:ALBIN_ORDERS_2, state.order_id)

      res = Map.put(state, :json_obj, Poison.encode!(:ok))
      {true, conn, res}
    end
  end

  resource "*string" do
    %{}
  after
    plug(Plug.Static, at: "/public", from: :back)
    require EEx
    EEx.function_from_file(:defp, :layout, "web/layout.html.eex", [:render])
    content_types_provided(do: ["text/html": :to_html])

    defh to_html do
      conn = fetch_query_params(conn)

      render =
        Reaxt.render!(
          :app,
          %{path: conn.request_path, cookies: conn.cookies, query: conn.params},
          30_000
        )
        |> layout()
    end
  end
end
