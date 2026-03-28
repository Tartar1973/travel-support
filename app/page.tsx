import Image from 'next/image'

const mockResult = {
  fromStation: 'Meguro',
  toStation: 'Shibuya',
  language: 'en',
  source: 'route_guide',
  steps: [
    {
      stepNo: 1,
      actionType: 'train',
      stationName: 'Meguro',
      lineName: 'JR Yamanote Line',
      platformNo: '1',
      boardDisplay: ['Shibuya'],
      avoidDisplay: ['Shinagawa'],
      getOffStation: 'Shibuya',
      stopCount: 2,
      instruction: 'Go to Platform 1 and board a train showing Shibuya.',
      sampleImagePath: '/samples/meguro_p1_shibuya_local.png',
    },
    {
      stepNo: 2,
      actionType: 'train',
      stationName: 'Meguro',
      lineName: 'JR Yamanote Line',
      platformNo: '2',
      boardDisplay: ['Shinagawa'],
      avoidDisplay: ['Shibuya'],
      getOffStation: 'Shinagawa',
      stopCount: 3,
      instruction: 'For the opposite direction, go to Platform 2 and board a train showing Shinagawa.',
      sampleImagePath: '/samples/meguro_p2_shinagawa_local.png',
    },
  ],
  notice:
    'This information is based on standard route guidance and may differ depending on delays, platform changes, or service disruptions on the day. Please also check station signs and official railway information.',
}

export default function HomePage() {
  const result = mockResult

  return (
    <main style={{ maxWidth: 860, margin: '0 auto', minHeight: '100vh', padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, margin: 0 }}>Station Support App</h1>
        <p className="muted" style={{ marginTop: 8 }}>
          Prototype screen with sample train display images
        </p>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 24, margin: 0 }}>Guide Result</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            {result.fromStation} → {result.toStation}
          </p>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {result.steps.map((step) => (
            <div key={step.stepNo} className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                Step {step.stepNo}
              </div>

              {step.platformNo && (
                <p style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px 0' }}>
                  Platform {step.platformNo}
                </p>
              )}

              {step.lineName && (
                <p className="muted" style={{ fontSize: 14, margin: '0 0 16px 0' }}>
                  Line: {step.lineName}
                </p>
              )}

              {step.sampleImagePath && (
                <div style={{ marginTop: 8 }}>
                  <p className="section-title">Train display sample</p>
                  <div className="image-wrap">
                    <Image
                      src={step.sampleImagePath}
                      alt="Sample train display"
                      width={800}
                      height={320}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                </div>
              )}

              {step.boardDisplay && step.boardDisplay.length > 0 && (
                <div style={{ marginTop: 16 }} className="card">
                  <div style={{ padding: 16 }}>
                    <p className="section-title" style={{ marginTop: 0 }}>
                      You can board this train
                    </p>
                    <div>
                      {step.boardDisplay.map((text, idx) => (
                        <span key={idx} className="badge">
                          {text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step.avoidDisplay && step.avoidDisplay.length > 0 && (
                <div style={{ marginTop: 16 }} className="card">
                  <div style={{ padding: 16 }}>
                    <p className="section-title" style={{ marginTop: 0 }}>
                      Do not board
                    </p>
                    <div>
                      {step.avoidDisplay.map((text, idx) => (
                        <span key={idx} className="badge">
                          {text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step.getOffStation && (
                <p style={{ marginTop: 16, marginBottom: 4 }}>
                  Get off at: <strong>{step.getOffStation}</strong>
                </p>
              )}

              {typeof step.stopCount === 'number' && (
                <p style={{ marginTop: 0, marginBottom: 4 }}>
                  Stops: <strong>{step.stopCount}</strong>
                </p>
              )}

              <p style={{ marginTop: 16, marginBottom: 0 }}>{step.instruction}</p>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 16, padding: 16, fontSize: 14 }}>
          <p style={{ fontWeight: 700, marginTop: 0, marginBottom: 8 }}>Important</p>
          <p style={{ margin: 0 }} className="muted">
            {result.notice}
          </p>
        </div>
      </div>
    </main>
  )
}
