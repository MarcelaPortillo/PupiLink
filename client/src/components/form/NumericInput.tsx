import { InputAdornment, TextField } from "@mui/material";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import FormUtils from "../../utils/FormUtils";

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  icon?: JSX.Element;
}

const NumericInput = <T extends FieldValues>(props: Props<T>) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field, formState: { errors } }) => {
        const formError = FormUtils.getFormError(props.name, errors);
        return (
          <TextField
            {...field}
            type="number"
            value={field.value ?? ""} 
            error={!!formError}
            helperText={formError}
            size="small"
            id="outlined-basic"
            variant="outlined"
            sx={{
              fontFamily: "Barlow Condensed, Arial",
              "& > *": { paddingLeft: "0px !important" },
              '& .MuiOutlinedInput-root': { bgcolor: "#dcdce8" }
            }}
            inputProps={{
              sx: { fontSize: "0.88rem", paddingBlock: "0.25rem", bgcolor: "#dcdce8", },
              inputMode: "numeric",
            }}
            InputProps={{
              type: "number",
              startAdornment: (
                <InputAdornment
                  sx={{
                    color: "#865DFF",
                    paddingLeft: "0.5rem !important",
                  }}
                  position="start"
                >
                  {props.icon}
                </InputAdornment>
              ),
            }}
          />
        )
      }
      }
    />
  );
}

export default NumericInput;