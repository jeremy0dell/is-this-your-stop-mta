import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import * as C from "../logic/constants";

const whiteStyle = {
  color: "white",
  fontSize: "22px !important",
  "&.Mui-checked": {
    color: "#FF9C28",
    fontSize: "22px !important",
  },
  "&.MuiFormControlLabel-label": {
    fontSize: "22px !important",
  },
  "& span": {
    fontSize: "22px !important",
  },
};

const ChartControls = ({
  value,
  type,
  isMoving,
  onMapChange,
  onTypeChange,
}) => {
  return (
    <FormControl sx={{ fontSize: "22px  !important" }}>
      <div>Demgraphic Option:</div>
      <RadioGroup value={value} onChange={onMapChange}>
        <FormControlLabel
          disabled={isMoving}
          sx={{ fontSize: "22px  !important" }}
          value={C.race}
          control={<Radio sx={whiteStyle} />}
          label={<Typography style={{ fontSize: 22 }}>Race</Typography>}
        />
        <FormControlLabel
          disabled={isMoving}
          sx={{ fontSize: "22px  !important" }}
          value={C.income}
          control={<Radio sx={whiteStyle} />}
          label={<Typography style={{ fontSize: 22 }}>Income</Typography>}
        />
      </RadioGroup>
      <div>Map Type:</div>
      <RadioGroup value={type} onChange={onTypeChange}>
        <FormControlLabel
          disabled={isMoving}
          sx={{ fontSize: "22px  !important" }}
          value={C.standard}
          control={<Radio sx={whiteStyle} />}
          label={<Typography style={{ fontSize: 22 }}>Standard</Typography>}
        />
        <FormControlLabel
          disabled={isMoving}
          sx={{ fontSize: "22px  !important" }}
          value={C.proportional}
          control={<Radio sx={whiteStyle} />}
          label={
            <Typography style={{ fontSize: 22 }}>Proportional</Typography>
          }
        />
      </RadioGroup>
    </FormControl>
  );
};

export default ChartControls;
