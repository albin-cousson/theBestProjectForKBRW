defmodule Back do
  use Application

  @impl true
  def start(_type, _args) do
    IO.puts("@@@@@@ DÉMARAGE, CHAUD DEVANT !!! @@@@@@")

    ServSupervisor.start_link(name: ServSupervisor)
    Application.put_env(
      :reaxt,:global_config,
      Map.merge(
        Application.get_env(:reaxt,:global_config), %{localhost: "http://localhost:4001"}
      )
    )
    Reaxt.reload
  end
end
