defmodule AccountServer do
  def start_link(initial_amount) do
    MyGenericServer.start_link(AccountServer, initial_amount)
  end

  def handle_cast({:credit, c}, amount) do
    amount + c
  end

  def handle_cast({:debit, c}, amount) do
    amount - c
  end

  def handle_call(:get, amount) do
    {amount, amount}
  end
end
