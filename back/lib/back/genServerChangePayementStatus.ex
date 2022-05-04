defmodule GenServerChangePayementStatus do
  use GenServer

  @impl true
  def init(order) do
    {:ok, order}
  end

  def start_link(order) do
    GenServer.start_link(__MODULE__, order, name: String.to_atom(order["id"]))
  end

  @impl true
  def handle_call(transition, _reply_to, order) do
    res = ExFSM.Machine.event(order, {transition, []})
    {:reply, res, order}
  end
end
