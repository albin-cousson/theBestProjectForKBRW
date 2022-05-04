defmodule ServSupervisor do
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, :ok, opts)
  end

  @impl true
  def init(:ok) do
    children = [
      {Task,
       fn ->
        JsonLoader.load_to_database(Database, "json_for_database/orders_chunk0.json")
       end},
      {Database, name: Database},
      # {Plug.Cowboy, scheme: :http, plug: Server.PlugRouter, options: [port: 4001]},
      {Plug.Cowboy, scheme: :http, plug: Server.EwebRouter, options: [port: 4002]},
    ]
    Supervisor.init(children, strategy: :one_for_one)
  end
end
