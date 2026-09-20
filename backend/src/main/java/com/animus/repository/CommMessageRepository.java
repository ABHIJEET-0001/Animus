package com.animus.repository;

import com.animus.model.CommMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommMessageRepository extends JpaRepository<CommMessage, Long> {
    List<CommMessage> findTop50ByOrderBySentAtDesc();
}
