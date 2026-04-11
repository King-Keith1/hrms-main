package com.company.hrms.service.payroll;

import com.company.hrms.entity.ContractType;
import org.springframework.stereotype.Component;

// Factory that selects the correct payroll strategy based on contract type
@Component
public class PayrollStrategyFactory {

    private final FullTimePayrollStrategy fullTimeStrategy;
    private final PartTimePayrollStrategy partTimeStrategy;
    private final ContractPayrollStrategy contractStrategy;

    public PayrollStrategyFactory(FullTimePayrollStrategy fullTimeStrategy,
                                  PartTimePayrollStrategy partTimeStrategy,
                                  ContractPayrollStrategy contractStrategy) {
        this.fullTimeStrategy = fullTimeStrategy;
        this.partTimeStrategy = partTimeStrategy;
        this.contractStrategy = contractStrategy;
    }

    public PayrollStrategy getStrategy(ContractType contractType) {
        return switch (contractType) {
            case FULL_TIME -> fullTimeStrategy;
            case PART_TIME -> partTimeStrategy;
            case CONTRACT -> contractStrategy;
        };
    }
}