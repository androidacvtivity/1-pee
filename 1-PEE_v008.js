(function ($) {
    Drupal.behaviors.pee1 = {
        attach: function (context, settings) {
            // Scrie doar numere
            jQuery("table").on(
                "keypress",
                "input.float, input.numeric",
                function (event) {
                    if (isNumberPressed(this, event) === false) {
                        event.preventDefault();
                    }
                }
            );
        },
    };

    webform.validators.pee1 = function (allowOverpass) {
        var values = Drupal.settings.mywebform.values;
        var errors = webform.errors;

        for (let i = 1; i <= 7; i++) {
            // Preluăm valorile din coloanele necesare pentru rândul curent
            // Folosim `|| 0` pentru a trata câmpurile goale ca fiind 0
            const col1 = new Decimal(values[`CAP1_R${i}_C01`] || 0);
            const col2 = new Decimal(values[`CAP1_R${i}_C02`] || 0);
            const col3 = new Decimal(values[`CAP1_R${i}_C03`] || 0);
            const col4 = new Decimal(values[`CAP1_R${i}_C04`] || 0);
            const col5 = new Decimal(values[`CAP1_R${i}_C05`] || 0);
            const col6 = new Decimal(values[`CAP1_R${i}_C06`] || 0);

            // Validarea 1: Cap.1: [Col.1] <= [Col.2] (pe fiecare rând)
            // Se verifică dacă valoarea din coloana 1 este mai mare decât cea din coloana 2
            if (col1.greaterThan(col2)) {
                errors.push({
                    weight: 10,
                    index: i,
                    fieldName: `CAP1_R${i}_C01`,
                    msg: `[01-001] (${col1}) trebuie să fie mai mică sau egală cu Coloana 2 (${col2}).`,
                });
            }

            // Validarea 2: Cap.1: [Col.2] <= [Col.3] (pe fiecare rând)
            // Se verifică dacă valoarea din coloana 2 este mai mare decât cea din coloana 3
            if (col2.greaterThan(col3)) {
                errors.push({
                    weight: 10,
                    index: i,
                    fieldName: `CAP1_R${i}_C02`,
                    msg: `[01-002] (${col2}) trebuie să fie mai mică sau egală cu Coloana 3 (${col3}).`,
                });
            }

            // Validarea 3: Cap.1: [Col.4] <= [Col.3] (pe fiecare rând)
            // Se verifică dacă valoarea din coloana 4 este mai mare decât cea din coloana 3
            if (col4.greaterThan(col3)) {
                errors.push({
                    weight: 10,
                    index: i,
                    fieldName: `CAP1_R${i}_C04`,
                    msg: `[01-003] (${col4}) trebuie să fie mai mică sau egală cu Coloana 3 (${col3}).`,
                });
            }

            // Validarea 4: Cap.1: [Col.5] <= [Col.3] (pe fiecare rând)
            // Se verifică dacă valoarea din coloana 5 este mai mare decât cea din coloana 3
            if (col5.greaterThan(col3)) {
                errors.push({
                    weight: 10,
                    index: i,
                    fieldName: `CAP1_R${i}_C05`,
                    msg: `[01-004] (${col5}) trebuie să fie mai mică sau egală cu Coloana 3 (${col3}).`,
                });
            }

            // Validarea 5: Cap.1: [Col.6] <= [Col.3] (pe fiecare rând)
            // Se verifică dacă valoarea din coloana 6 este mai mare decât cea din coloana 3
            if (col6.greaterThan(col3)) {
                errors.push({
                    weight: 10,
                    index: i,
                    fieldName: `CAP1_R${i}_C06`,
                    msg: `[01-006] (${col6}) trebuie să fie mai mică sau egală cu Coloana 3 (${col3}).`,
                });
            }

            // Validare: Cap.1: [Col.7/8] corespunde intervalului din [Col.B] (pe fiecare rând)
            const col7 = new Decimal(values[`CAP1_R${i}_C07`] || 0);
            const col8 = new Decimal(values[`CAP1_R${i}_C08`] || 0);

            // Se execută validarea doar dacă există consumatori (Col.8 > 0) pentru a evita împărțirea la zero.
            if (col8.greaterThan(0)) {
                const consumMediu = col7.div(col8);
                let isValid = true;
                let intervalText = "";

                // Se definesc limitele intervalului pentru fiecare rând în parte
                switch (i) {
                    case 1: // până la 20
                        intervalText = "până la 20";
                        if (consumMediu.greaterThan(20)) isValid = false;
                        break;
                    case 2: // de la 20 până la 500
                        intervalText = "între 20 și 500";
                        if (
                            consumMediu.lessThanOrEqualTo(20) ||
                            consumMediu.greaterThan(500)
                        )
                            isValid = false;
                        break;
                    case 3: // de la 500 până la 2000
                        intervalText = "între 500 și 2000";
                        if (
                            consumMediu.lessThanOrEqualTo(500) ||
                            consumMediu.greaterThan(2000)
                        )
                            isValid = false;
                        break;
                    case 4: // de la 2000 până la 20000
                        intervalText = "între 2000 și 20000";
                        if (
                            consumMediu.lessThanOrEqualTo(2000) ||
                            consumMediu.greaterThan(20000)
                        )
                            isValid = false;
                        break;
                    case 5: // de la 20000 până la 70000
                        intervalText = "între 20000 și 70000";
                        if (
                            consumMediu.lessThanOrEqualTo(20000) ||
                            consumMediu.greaterThan(70000)
                        )
                            isValid = false;
                        break;
                    case 6: // de la 70000 până la 150000
                        intervalText = "între 70000 și 150000";
                        if (
                            consumMediu.lessThanOrEqualTo(70000) ||
                            consumMediu.greaterThan(150000)
                        )
                            isValid = false;
                        break;
                    case 7: // de la 150000
                        intervalText = "peste 150000";
                        if (consumMediu.lessThanOrEqualTo(150000)) isValid = false;
                        break;
                }

                if (!isValid) {
                    errors.push({
                        weight: 15,
                        index: i,
                        fieldName: `CAP1_R${i}_C07`,
                        msg: `[01-007] Consumul mediu per consumator (Col.7 / Col.8 = ${consumMediu.toFixed(
                            2
                        )} mii kWh) nu corespunde intervalului grupei ("${intervalText}").`,
                    });
                }
            }
        }

        // --- Validări pentru Capitolul II ---
        // Iterăm prin fiecare rând al tabelului, de la 1 la 5
        for (let i = 1; i <= 5; i++) {
            // Preluăm valorile din coloanele necesare pentru rândul curent
            // Notă: ID-urile câmpurilor încep cu CAP2 și nu au sufixul `[0]`
            const col1 = new Decimal(values[`CAP2_R${i}_C01`] || 0);
            const col2 = new Decimal(values[`CAP2_R${i}_C02`] || 0);
            const col3 = new Decimal(values[`CAP2_R${i}_C03`] || 0);
            const col4 = new Decimal(values[`CAP2_R${i}_C04`] || 0);
            const col5 = new Decimal(values[`CAP2_R${i}_C05`] || 0);
            const col6 = new Decimal(values[`CAP2_R${i}_C06`] || 0);

            // Validarea 1: Cap.2: [Col.1] <= [Col.2] (pe fiecare rând)
            if (col1.greaterThan(col2)) {
                errors.push({
                    weight: 20,
                    index: i,
                    fieldName: `CAP2_R${i}_C01`,
                    msg: `[02-001] (${col1}) trebuie să fie mai mică sau egală cu Coloana 2 (${col2}).`,
                });
            }

            // Validarea 2: Cap.2: [Col.2] <= [Col.3] (pe fiecare rând)
            if (col2.greaterThan(col3)) {
                errors.push({
                    weight: 20,
                    index: i,
                    fieldName: `CAP2_R${i}_C02`,
                    msg: `[02-002] (${col2}) trebuie să fie mai mică sau egală cu Coloana 3 (${col3}).`,
                });
            }

            // Validarea 3: Cap.2: [Col.4] <= [Col.3] (pe fiecare rând)
            if (col4.greaterThan(col3)) {
                errors.push({
                    weight: 20,
                    index: i,
                    fieldName: `CAP2_R${i}_C04`,
                    msg: `[02-003] (${col4}) trebuie să fie mai mică sau egală cu Coloana 3 (${col3}).`,
                });
            }

            // Validarea 4: Cap.2: [Col.5] <= [Col.3] (pe fiecare rând)
            if (col5.greaterThan(col3)) {
                errors.push({
                    weight: 20,
                    index: i,
                    fieldName: `CAP2_R${i}_C05`,
                    msg: `[02-004] (${col5}) trebuie să fie mai mică sau egală cu Coloana 3 (${col3}).`,
                });
            }

            // Validarea 5: Cap.2: [Col.6] <= [Col.3] (pe fiecare rând)
            if (col6.greaterThan(col3)) {
                errors.push({
                    weight: 20,
                    index: i,
                    fieldName: `CAP2_R${i}_C06`,
                    msg: `[02-005] (${col6}) trebuie să fie mai mică sau egală cu Coloana 3 (${col3}).`,
                });
            }

            // Validare: Cap.2: [Col.7*1000/8] corespunde intervalului din [Col.B] (pe fiecare rând)
            const col7 = new Decimal(values[`CAP2_R${i}_C07`] || 0);
            const col8 = new Decimal(values[`CAP2_R${i}_C08`] || 0);

            // Se execută validarea doar dacă există consumatori (Col.8 > 0)
            if (col8.greaterThan(0)) {
                // Col.7 este în "mii kWh", iar intervalul în "kWh", de aceea se înmulțește cu 1000
                const consumMediuKwh = col7.times(1000).div(col8);
                let isValid = true;
                let intervalText = "";

                // Se definesc limitele intervalului pentru fiecare rând
                switch (i) {
                    case 1: // până la 1000
                        intervalText = "până la 1000 kWh";
                        if (consumMediuKwh.greaterThan(1000)) isValid = false;
                        break;
                    case 2: // de la 1000 până la 2500
                        intervalText = "între 1000 și 2500 kWh";
                        if (
                            consumMediuKwh.lessThanOrEqualTo(1000) ||
                            consumMediuKwh.greaterThan(2500)
                        )
                            isValid = false;
                        break;
                    case 3: // de la 2500 până la 5000
                        intervalText = "între 2500 și 5000 kWh";
                        if (
                            consumMediuKwh.lessThanOrEqualTo(2500) ||
                            consumMediuKwh.greaterThan(5000)
                        )
                            isValid = false;
                        break;
                    case 4: // de la 5000 până la 15000
                        intervalText = "între 5000 și 15000 kWh";
                        if (
                            consumMediuKwh.lessThanOrEqualTo(5000) ||
                            consumMediuKwh.greaterThan(15000)
                        )
                            isValid = false;
                        break;
                    case 5: // de la 15000
                        intervalText = "peste 15000 kWh";
                        if (consumMediuKwh.lessThanOrEqualTo(15000)) isValid = false;
                        break;
                }

                if (!isValid) {
                    errors.push({
                        weight: 25,
                        index: i,
                        fieldName: `CAP2_R${i}_C07`,
                        msg: `[02-006] Consumul mediu per consumator (${consumMediuKwh.toFixed(
                            2
                        )} kWh) nu corespunde intervalului grupei ("${intervalText}").`,
                    });
                }
            }
        }

        webform.validatorsStatus["pee1"] = 1;
        validateWebform();
    };
})(jQuery);
