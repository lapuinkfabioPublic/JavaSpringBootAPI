package com.minibank.api.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TransacaoPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publicar(String evento) {
        rabbitTemplate.convertAndSend("transacoes.exchange", "transacao.#", evento);
    }
}
