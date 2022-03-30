defmodule MyGenericServer do
    defp loop(callback_module, server_state) do
        receive do
            {:cast, request} ->
                newAmount = callback_module.handle_cast(request, server_state)
                loop(callback_module, newAmount)
            {:call, request, process_pid} ->
                {res, server_state} = callback_module.handle_call(request, server_state)
                send(process_pid, res)
                loop(callback_module, server_state)
        end
    end

    def start_link(callback_module, server_state) do
        {:ok, spawn_link(fn -> loop(callback_module, server_state) end)}
    end 

    def cast(process_pid, request) do
        send(process_pid, {:cast, request})
        :ok
    end

    def call(process_pid, request) do
        send(process_pid, {:call, request, self()}) 
        receive do 
            x -> x
        end
    end
end