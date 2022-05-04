defmodule Back.MixProject do
  use Mix.Project

  def project do
    [
      app: :back,
      version: "0.1.0",
      elixir: "~> 1.13",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      compilers: [:reaxt_webpack] ++ Mix.compilers
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger, :inets, :ssl],
      mod: {Back, []},
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:poison, "~> 5.0.0", override: true},
      {:plug_cowboy, "~> 2.4"},
      {:reaxt, tag: "v4.0.2", github: "kbrw/reaxt"},
      {:exfsm, git: "https://github.com/kbrw/exfsm.git"},
      {:ewebmachine, github: "kbrw/ewebmachine"}
    ]
  end
end
