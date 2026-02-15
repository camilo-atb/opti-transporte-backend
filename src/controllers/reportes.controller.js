import reportesService from "../services/reportes.service.js";

export const resumenGeneral = async (req, res, next) => {
  try {
    const data = await reportesService.resumenGeneral();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const reporteMensual = async (req, res, next) => {
  try {
    const { mes, año } = req.query;

    if (!mes || !año) {
      return res.status(400).json({
        error: "Mes y año son requeridos",
      });
    }

    const data = await reportesService.reporteMensual(
      parseInt(mes),
      parseInt(año)
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const reportePorFechas = async (req, res, next) => {
  try {
    const { desde, hasta } = req.query;

    if (!desde || !hasta) {
      return res.status(400).json({
        error: "Fechas desde y hasta son requeridas",
      });
    }

    const data = await reportesService.reportePorFechas(
      desde,
      hasta
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const ventasPorOperario = async (req, res, next) => {
  try {
    const data = await reportesService.ventasPorOperario();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};


export const ventasPorRuta = async (req, res, next) => {
  try {
    const data = await reportesService.ventasPorRuta();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};


export const ocupacionPorViaje = async (req, res, next) => {
  try {
    const data = await reportesService.ocupacionPorViaje();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const topRutas = async (req, res, next) => {
  try {
    const { limit } = req.query;

    const data = await reportesService.topRutas(
      limit ? parseInt(limit) : 5
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const historicoAnual = async (req, res, next) => {
  try {
    const { año } = req.query;

    if (!año) {
      return res.status(400).json({
        error: "El año es requerido",
      });
    }

    const data = await reportesService.historicoAnual(
      parseInt(año)
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
