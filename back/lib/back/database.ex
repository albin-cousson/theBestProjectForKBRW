defmodule Database do
  use GenServer

  def start_link(opts) do
    table = Keyword.fetch!(opts, :name)
    GenServer.start_link(__MODULE__, table, opts)
  end

  def lookup(key) do
    GenServer.call(__MODULE__, {:get, key})
  end

  def create(data) do
    GenServer.cast(__MODULE__, {:create, data})
  end

  def update({key, value}) do
    GenServer.cast(__MODULE__, {:update, {key, value}})
  end

  def delete(key) do
    GenServer.cast(__MODULE__, {:delete, key})
  end

  @impl true
  def init(table) do
    ^table = :ets.new(table, [:named_table, read_concurrency: true])
    {:ok, table}
  end

  @impl true 
  def handle_call({:get, key}, _from, table) do 
    case :ets.lookup(table, key) do
      [{^key, data}] -> {:reply, {:ok, data}, table}
      [] -> {:reply, nil, table}
    end
  end

  @impl true
  def handle_cast({:create, data}, table) do
    :ets.insert(table, data)
    {:noreply, table}
  end

  @impl true
  def handle_cast({:update, {key, value}}, table) do
    case :ets.lookup(table, key) do
      [{^key, data}] -> 
        :ets.insert(table, {key, value})
        {:noreply, table}
      [] -> {:noreply, table}
    end
  end

  @impl true
  def handle_cast({:delete, key}, table) do
    :ets.delete(table, key)
    {:noreply, table}
  end

end
