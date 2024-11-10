class Response {
  constructor(data = null, message = null, status) {
    (this.data = data), (this.message = message), (this.status = status);
  }

  success(res) {
    return res.status(200).json({
      success: true,
      data: this.data,
      message: this.message ?? "İşlem başarılı.",
    });
  }

  created(res) {
    return res.status(201).json({
      success: true,
      data: this.data,
      message: this.message ?? "İşlem başarılı.",
    });
  }

  error500(res) {
    return res.status(500).json({
      success: false,
      data: this.data,
      message: this.message ?? "İşlem başarısız!",
    });
  }
}
