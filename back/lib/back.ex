defmodule Back do
  use Application

  @impl true
  def start(_type, _args) do
    IO.puts("Superviseur démarrer")
    ServSupervisor.start_link(name: ServSupervisor)
  end
end
