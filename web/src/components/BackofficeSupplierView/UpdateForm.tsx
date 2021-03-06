import * as React from "react";
import { Box } from "../Box/Box";
import * as classes from "./UpdateForm.treat";
import { TextField } from "../Field/TextField";
import { Title } from "../Text/Title";
import { useFormatMessage, FormattedMessage } from "../../intl";
import * as O from "fp-ts/lib/Option";
import { Space } from "../Space/Space";
import { Button } from "../Button/Button";
import * as t from "io-ts";
import { IntFromString } from "io-ts-types/lib/IntFromString";
import { pipe } from "fp-ts/lib/pipeable";
import * as E from "fp-ts/lib/Either";
import * as R from "fp-ts/lib/ReadonlyRecord";
import { intercalateChildren, Children } from "../../util";
import { Label } from "../Text/Label";
import { sequenceS } from "fp-ts/lib/Apply";
import { getStructSemigroup, Semigroup } from "fp-ts/lib/Semigroup";
import { Link } from "../Link/Link";
import { legal } from "./BackofficeSupplierView.treat";
import { identity } from "fp-ts/lib/function";
import { CheckboxField } from "../Field/CheckboxField";
import { useIsMobile } from "../../useMatchMedia";

type Props = {
  previousValues: Values;
  onSubmit: (values: Values) => unknown;
  requireAcceptance: boolean;
};

type FormState = {
  mascherineFFP: string;
  mascherineChirurgiche: string;
  mascherineLavabili: string;
  gel: string;
  guanti: string;
  scanner: string;
  alchool: string;
  pulsossimetri: string;
  bomboleossigeno: string;
  acceptance: boolean;
};

interface PositiveBrand {
  readonly Positive: unique symbol;
}

const PositiveFromString = t.brand(
  IntFromString,
  (n): n is t.Branded<t.TypeOf<typeof IntFromString>, PositiveBrand> =>
    !isNaN(n) && n >= 0,
  "Positive"
);

export const Values = t.type(
  {
    mascherineFFP: t.number,
    mascherineChirurgiche: t.number,
    mascherineLavabili: t.number,
    gel: t.number,
    guanti: t.number,
    scanner: t.number,
    alchool: t.number,
    pulsossimetri: t.number,
    bomboleossigeno: t.number,
  },
  "Values"
);

export type Values = t.TypeOf<typeof Values>;

type Errors = Record<keyof FormState, O.Option<string>>;

function error<K extends keyof Errors>(k: K, message: string): Errors {
  return {
    mascherineFFP: O.none,
    mascherineChirurgiche: O.none,
    mascherineLavabili: O.none,
    gel: O.none,
    guanti: O.none,
    scanner: O.none,
    alchool: O.none,
    pulsossimetri: O.none,
    bomboleossigeno: O.none,
    acceptance: O.none,
    [k]: O.some(message),
  };
}

const errorSemigroup: Semigroup<O.Option<string>> = {
  concat: (a, b) =>
    pipe(
      b,
      O.alt(() => a)
    ),
};
const errorsSemigroup: Semigroup<Errors> = getStructSemigroup({
  mascherineFFP: errorSemigroup,
  mascherineChirurgiche: errorSemigroup,
  mascherineLavabili: errorSemigroup,
  gel: errorSemigroup,
  guanti: errorSemigroup,
  scanner: errorSemigroup,
  alchool: errorSemigroup,
  pulsossimetri: errorSemigroup,
  bomboleossigeno: errorSemigroup,
  acceptance: errorSemigroup,
});

function validateForm(
  formState: FormState,
  errorMessages: { [K in keyof Errors]: string }
): E.Either<Errors, Values> {
  return pipe(
    sequenceS(E.getValidation(errorsSemigroup))({
      mascherineFFP: pipe(
        PositiveFromString.decode(formState.mascherineFFP),
        E.mapLeft(() => error("mascherineFFP", errorMessages.mascherineFFP))
      ),
      mascherineChirurgiche: pipe(
        PositiveFromString.decode(formState.mascherineChirurgiche),
        E.mapLeft(() =>
          error("mascherineChirurgiche", errorMessages.mascherineChirurgiche)
        )
      ),
      mascherineLavabili: pipe(
        PositiveFromString.decode(formState.mascherineLavabili),
        E.mapLeft(() =>
          error("mascherineLavabili", errorMessages.mascherineLavabili)
        )
      ),
      gel: pipe(
        PositiveFromString.decode(formState.gel),
        E.mapLeft(() => error("gel", errorMessages.gel))
      ),
      guanti: pipe(
        PositiveFromString.decode(formState.guanti),
        E.mapLeft(() => error("guanti", errorMessages.guanti))
      ),
      scanner: pipe(
        PositiveFromString.decode(formState.scanner),
        E.mapLeft(() => error("scanner", errorMessages.scanner))
      ),
      alchool: pipe(
        PositiveFromString.decode(formState.alchool),
        E.mapLeft(() => error("alchool", errorMessages.alchool))
      ),
      pulsossimetri: pipe(
        PositiveFromString.decode(formState.pulsossimetri),
        E.mapLeft(() => error("pulsossimetri", errorMessages.pulsossimetri))
      ),
      bomboleossigeno: pipe(
        PositiveFromString.decode(formState.bomboleossigeno),
        E.mapLeft(() => error("bomboleossigeno", errorMessages.bomboleossigeno))
      ),
      acceptance: pipe(
        formState.acceptance,
        E.fromPredicate(identity, () =>
          error("acceptance", errorMessages.acceptance)
        )
      ),
    }),
    E.map(
      ({
        mascherineFFP,
        mascherineChirurgiche,
        mascherineLavabili,
        gel,
        guanti,
        scanner,
        alchool,
        pulsossimetri,
        bomboleossigeno,
      }) => ({
        mascherineFFP,
        mascherineChirurgiche,
        mascherineLavabili,
        gel,
        guanti,
        scanner,
        alchool,
        pulsossimetri,
        bomboleossigeno,
      })
    )
  );
}

function FieldSet(props: { children: Children }) {
  return (
    <Box column className={classes.fieldSet}>
      {props.children}
    </Box>
  );
}

export function UpdateViewForm(props: Props) {
  const formatMessage = useFormatMessage();
  const [formState, setFormState] = React.useState<FormState>({
    mascherineFFP: String(props.previousValues.mascherineFFP),
    mascherineChirurgiche: String(props.previousValues.mascherineChirurgiche),
    mascherineLavabili: String(props.previousValues.mascherineLavabili),
    gel: String(props.previousValues.gel),
    guanti: String(props.previousValues.guanti),
    scanner: String(props.previousValues.scanner),
    alchool: String(props.previousValues.alchool),
    pulsossimetri: String(props.previousValues.pulsossimetri),
    bomboleossigeno: String(props.previousValues.bomboleossigeno),
    acceptance: !props.requireAcceptance,
  });
  const [
    submittedWithInlineErrors,
    setSubmittedWithInlineErrors,
  ] = React.useState<O.Option<Errors>>(O.none);
  const onChange = <K extends keyof FormState>(field: K) => (
    value: FormState[K]
  ) => {
    setFormState(s => ({ ...s, [field]: value }));
  };
  const changed = {
    mascherineFFP:
      formState.mascherineFFP === String(props.previousValues.mascherineFFP),
    mascherineChirurgiche:
      formState.mascherineChirurgiche ===
      String(props.previousValues.mascherineChirurgiche),
    mascherineLavabili:
      formState.mascherineLavabili ===
      String(props.previousValues.mascherineLavabili),
    gel: formState.gel === String(props.previousValues.gel),
    guanti: formState.guanti === String(props.previousValues.guanti),
    scanner: formState.scanner === String(props.previousValues.scanner),
    alchool: formState.alchool === String(props.previousValues.alchool),
    pulsossimetri:
      formState.pulsossimetri === String(props.previousValues.pulsossimetri),
    bomboleossigeno:
      formState.bomboleossigeno === String(props.previousValues.bomboleossigeno),
  };
  function onSubmit() {
    const validated = validateForm(formState, {
      mascherineFFP: formatMessage("UpdateViewForm.errorMascherine"),
      mascherineChirurgiche: formatMessage("UpdateViewForm.errorMascherine"),
      mascherineLavabili: formatMessage("UpdateViewForm.errorMascherine"),
      gel: formatMessage("UpdateViewForm.errorGel"),
      guanti: formatMessage("UpdateViewForm.errorGuanti"),
      scanner: formatMessage("UpdateViewForm.errorScanner"),
      alchool: formatMessage("UpdateViewForm.errorAlchool"),
      pulsossimetri: formatMessage("UpdateViewForm.errorPulsossimetri"),
      bomboleossigeno: formatMessage("UpdateViewForm.errorBomboleossigeno"),
      acceptance: formatMessage("UpdateViewForm.errorAcceptance"),
    });
    if (E.isRight(validated)) {
      setSubmittedWithInlineErrors(O.none);
      props.onSubmit(validated.right);
    } else {
      setSubmittedWithInlineErrors(O.some(validated.left));
    }
  }
  const changedLabel = (
    <Label size={2}>{formatMessage("UpdateViewForm.invariato")}</Label>
  );
  const labels = pipe(
    {
      mascherineFFP: ([
        <FormattedMessage
          tagName="span"
          id="UpdateViewForm.labelMascherineFFP"
        />,
      ] as Children[]).concat(changed.mascherineFFP ? [changedLabel] : []),
      mascherineChirurgiche: ([
        <FormattedMessage
          tagName="span"
          id="UpdateViewForm.labelMascherineChirurgiche"
        />,
      ] as Children[]).concat(
        changed.mascherineChirurgiche ? [changedLabel] : []
      ),
      mascherineLavabili: ([
        <FormattedMessage
          tagName="span"
          id="UpdateViewForm.labelMascherineLavabili"
        />,
      ] as Children[]).concat(changed.mascherineLavabili ? [changedLabel] : []),
      alchool: ([
        <FormattedMessage tagName="span" id="UpdateViewForm.labelAlchool" />,
      ] as Children[]).concat(changed.alchool ? [changedLabel] : []),
      gel: ([
        <FormattedMessage tagName="span" id="UpdateViewForm.labelGel" />,
      ] as Children[]).concat(changed.gel ? [changedLabel] : []),
      guanti: ([
        <FormattedMessage tagName="span" id="UpdateViewForm.labelGuanti" />,
      ] as Children[]).concat(changed.guanti ? [changedLabel] : []),
      scanner: ([
        <FormattedMessage tagName="span" id="UpdateViewForm.labelScanner" />,
      ] as Children[]).concat(changed.scanner ? [changedLabel] : []),
      pulsossimetri: ([
        <FormattedMessage
          tagName="span"
          id="UpdateViewForm.labelPulsossimetri"
        />,
      ] as Children[]).concat(changed.pulsossimetri ? [changedLabel] : []),
      bomboleossigeno: ([
        <FormattedMessage
          tagName="span"
          id="UpdateViewForm.labelBomboleossigeno"
        />,
      ] as Children[]).concat(changed.bomboleossigeno ? [changedLabel] : []),
    },
    R.map(labels => intercalateChildren(<>&nbsp;</>, labels))
  );

  const isMobile = useIsMobile();
  return (
    <Box grow className={classes.form}>
      <form
        className={classes.formForm}
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          onSubmit();
        }}
      >
        <input type="submit" style={{ display: "none" }} />
        <Box column>
          {!isMobile && <Space units={6} />}
          <Title size={3}>{formatMessage("UpdateViewForm.header")}</Title>
          <Space units={6} />
          <FieldSet>
            <Label size={1}>
              {formatMessage("UpdateViewForm.titleMascherine")}
            </Label>
            <Space units={2} />
            <TextField
              type="number"
              error={pipe(
                submittedWithInlineErrors,
                O.chain(e => e.mascherineChirurgiche)
              )}
              value={formState.mascherineChirurgiche}
              onChange={onChange("mascherineChirurgiche")}
              label={labels.mascherineChirurgiche}
              labelSize={2}
              placeholder={formatMessage(
                "UpdateViewForm.placeholderMascherine"
              )}
              clearable={O.some("0")}
              width="100%"
            />
            <Space units={2} />
            <TextField
              type="number"
              error={pipe(
                submittedWithInlineErrors,
                O.chain(e => e.mascherineFFP)
              )}
              value={formState.mascherineFFP}
              onChange={onChange("mascherineFFP")}
              label={labels.mascherineFFP}
              labelSize={2}
              placeholder={formatMessage(
                "UpdateViewForm.placeholderMascherine"
              )}
              clearable={O.some("0")}
              width="100%"
            />
            <Space units={2} />
            <TextField
              type="number"
              error={pipe(
                submittedWithInlineErrors,
                O.chain(e => e.mascherineLavabili)
              )}
              value={formState.mascherineLavabili}
              onChange={onChange("mascherineLavabili")}
              label={labels.mascherineLavabili}
              labelSize={2}
              placeholder={formatMessage(
                "UpdateViewForm.placeholderMascherine"
              )}
              clearable={O.some("0")}
              width="100%"
            />
          </FieldSet>
          <Space units={6} />
          <FieldSet>
            <TextField
              type="number"
              error={pipe(
                submittedWithInlineErrors,
                O.chain(e => e.alchool)
              )}
              value={formState.alchool}
              onChange={onChange("alchool")}
              label={labels.alchool}
              labelSize={1}
              placeholder={formatMessage("UpdateViewForm.placeholderAlchool")}
              clearable={O.some("0")}
              width="100%"
            />
          </FieldSet>
          <Space units={6} />
          <FieldSet>
            <TextField
              type="number"
              error={pipe(
                submittedWithInlineErrors,
                O.chain(e => e.gel)
              )}
              value={formState.gel}
              onChange={onChange("gel")}
              label={labels.gel}
              labelSize={1}
              placeholder={formatMessage("UpdateViewForm.placeholderGel")}
              clearable={O.some("0")}
              width="100%"
            />
          </FieldSet>
          <Space units={6} />
          <FieldSet>
            <TextField
              type="number"
              error={pipe(
                submittedWithInlineErrors,
                O.chain(e => e.guanti)
              )}
              value={formState.guanti}
              onChange={onChange("guanti")}
              label={labels.guanti}
              labelSize={1}
              placeholder={formatMessage("UpdateViewForm.placeholderGuanti")}
              clearable={O.some("0")}
              width="100%"
            />
          </FieldSet>
          <Space units={6} />
          <FieldSet>
            <TextField
              type="number"
              error={pipe(
                submittedWithInlineErrors,
                O.chain(e => e.scanner)
              )}
              value={formState.scanner}
              onChange={onChange("scanner")}
              label={labels.scanner}
              labelSize={1}
              placeholder={formatMessage("UpdateViewForm.placeholderScanner")}
              clearable={O.some("0")}
              width="100%"
            />
          </FieldSet>
          <Space units={6} />
          <FieldSet>
            <TextField
              type="number"
              error={pipe(
                submittedWithInlineErrors,
                O.chain(e => e.pulsossimetri)
              )}
              value={formState.pulsossimetri}
              onChange={onChange("pulsossimetri")}
              label={labels.pulsossimetri}
              labelSize={1}
              placeholder={formatMessage(
                "UpdateViewForm.placeholderPulsossimetri"
              )}
              clearable={O.some("0")}
              width="100%"
            />
          </FieldSet>
          <Space units={6} />
          <FieldSet>
            <TextField
              type="number"
              error={pipe(
                submittedWithInlineErrors,
                O.chain(e => e.bomboleossigeno)
              )}
              value={formState.bomboleossigeno}
              onChange={onChange("bomboleossigeno")}
              label={labels.bomboleossigeno}
              labelSize={1}
              placeholder={formatMessage("UpdateViewForm.placeholderBomboleossigeno")}
              clearable={O.some("0")}
              width="100%"
            />
          </FieldSet>
          <Space units={8} />
          {props.requireAcceptance ? (
            <CheckboxField
              value={formState.acceptance}
              onChange={onChange("acceptance")}
              label={
                <>
                  Accetto di aver letto e aver preso visione dei{" "}
                  <Link target="_blank" href="/terms-and-conditions.pdf">
                    termini e condizioni
                  </Link>{" "}
                  del servizio e della{" "}
                  <Link target="_blank" href="/privacy-policy.pdf">
                    privacy policy
                  </Link>{" "}
                  e di accettarne il contenuto.
                </>
              }
              error={pipe(
                submittedWithInlineErrors,
                O.chain(e => e.acceptance)
              )}
            />
          ) : (
            <Label size={2} className={legal}>
              Cliccando su “Conferma e aggiorna disponibilità” o proseguendo
              nella navigazione dichiari di aver letto e aver preso visione dei{" "}
              <Link target="_blank" href="/terms-and-conditions.pdf">
                termini e condizioni
              </Link>{" "}
              del servizio e della{" "}
              <Link target="_blank" href="/privacy-policy.pdf">
                privacy policy
              </Link>{" "}
              e di accettarne il contenuto.
            </Label>
          )}
          <Space units={4} />
          <Button
            variant="primary"
            size="medium"
            label={formatMessage("UpdateViewForm.buttonLabel")}
            action={onSubmit}
            icon={O.none}
          />
        </Box>
      </form>
    </Box>
  );
}
