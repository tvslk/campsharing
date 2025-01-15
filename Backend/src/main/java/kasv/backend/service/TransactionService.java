package kasv.backend.service;

import kasv.backend.model.Transaction;
import kasv.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction makeReservation(Transaction transaction) {
        if (isOverlapping(transaction)) {
            throw new IllegalArgumentException("Reservation overlaps with an existing reservation");
        }
        return transactionRepository.save(transaction);
    }

    private boolean isOverlapping(Transaction newTransaction) {
        List<Transaction> existingTransactions = transactionRepository.findByGadgetId(newTransaction.getGadgetId());
        for (Transaction existingTransaction : existingTransactions) {
            if (newTransaction.getStartDate().before(existingTransaction.getEndDate()) &&
                    newTransaction.getEndDate().after(existingTransaction.getStartDate())) {
                return true;
            }
        }
        return false;
    }

    public List<Transaction> getReservationsByGadgetId(Long gadgetId) {
        return transactionRepository.findByGadgetId(gadgetId);
    }

    public List<Transaction> getAllReservations() {
        return transactionRepository.findAll();
    }

    public List<Transaction> getReservationByUserId(Long userId) {
        return transactionRepository.findByUserId(userId);
    }
}