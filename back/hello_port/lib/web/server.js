require('@kbrw/node_erlastic').server(function(term,from,current_amount,done){
    if (term == "hello") return done("reply", "hello world");
    throw new Error("unexpected request")
  });