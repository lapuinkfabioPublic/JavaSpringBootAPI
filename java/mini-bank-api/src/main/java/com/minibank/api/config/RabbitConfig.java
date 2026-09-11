package com.minibank.api.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.*;

@Configuration
public class RabbitConfig {

    @Bean TopicExchange exchange() { return new TopicExchange("transacoes.exchange"); }

    @Bean Queue fila() { return new Queue("transacoes.queue"); }

    @Bean Binding binding(Queue fila, TopicExchange exchange) {
        return BindingBuilder.bind(fila).to(exchange).with("transacao.#");
    }
}
